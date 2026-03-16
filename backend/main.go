package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

var (
	firebaseAuth    *auth.Client
	firestoreClient *firestore.Client
)

// Data Structures
type WeekItem struct {
	Day        int         `firestore:"day" json:"day"`
	ExtraCount int         `firestore:"extraCount" json:"extraCount"`
	ID         interface{} `firestore:"id" json:"id"` // String və ya Number ola bilər
	Images     []string    `firestore:"images" json:"images"`
	Subtitle   string      `firestore:"subtitle" json:"subtitle"`
	Title      string      `firestore:"title" json:"title"`
	Type       string      `firestore:"type" json:"type"`
}

type ProgramWeeksDoc struct {
	CreatedAt interface{}           `firestore:"createdAt" json:"createdAt"`
	UserID    string                `firestore:"userId" json:"userId"`
	Weeks     map[string][]WeekItem `firestore:"weeks" json:"weeks"`
	Name      string                `json:"name"` // user_programs kolleksiyasından gələn ad
}

type MuscleGroup struct {
	Name     string `firestore:"name" json:"name"`
	ImageURL string `firestore:"imageUrl" json:"imageUrl"`
}

type ExerciseDetail struct {
	Name         string        `firestore:"name" json:"name"`
	Reps         interface{}   `firestore:"reps" json:"reps"` // string or int
	Sets         interface{}   `firestore:"sets" json:"sets"` // string or int
	VideoURL     string        `firestore:"videoUrl" json:"videoUrl"`
	MuscleGroups []MuscleGroup `firestore:"muscleGroups" json:"muscleGroups"`
	MainImage    string        `firestore:"mainImage" json:"mainImage"`
	ImageURL     string        `firestore:"imageUrl" json:"imageUrl"` // Fallback for mainImage
	Instructions string        `firestore:"instructions" json:"instructions"`
}

type WorkoutPlanResponse struct {
	Name      string           `json:"name"`
	Exercises []ExerciseDetail `json:"exercises"`
}

// authMiddleware gələn sorğulardakı Firebase ID Token-i yoxlayır
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// CORS Headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// "Authorization: Bearer <token>" başlığını (header) alırıq
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization başlığı tapılmadı", http.StatusUnauthorized)
			return
		}

		// Token hissəsini ayırırıq
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || strings.ToLower(tokenParts[0]) != "bearer" {
			http.Error(w, "Yanlış Authorization formatı. 'Bearer <token>' olmalıdır", http.StatusUnauthorized)
			return
		}
		idToken := tokenParts[1]

		// Token-i Firebase ilə doğrulayırıq
		token, err := firebaseAuth.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			http.Error(w, fmt.Sprintf("Token etibarsızdır: %v", err), http.StatusUnauthorized)
			return
		}

		// Token-i context-ə əlavə edirik ki, handler-lər istifadə edə bilsin
		ctx := context.WithValue(r.Context(), "userToken", token)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// Firestore-dan sənədi retry ilə oxuyan helper funksiya
func getDocumentWithRetry(ctx context.Context, docRef *firestore.DocumentRef) (*firestore.DocumentSnapshot, error) {
	var err error
	var doc *firestore.DocumentSnapshot

	for i := 0; i < 3; i++ {
		doc, err = docRef.Get(ctx)
		if err == nil {
			return doc, nil
		}
		
		errMsg := err.Error()
		if strings.Contains(errMsg, "Unavailable") || strings.Contains(errMsg, "forcibly closed") || strings.Contains(errMsg, "transport is closing") {
			log.Printf("Retrying Firestore Get due to error: %v (Attempt %d/3)", err, i+1)
			time.Sleep(500 * time.Millisecond)
			continue
		}
		
		// Digər xətalar (məsələn NotFound) dərhal qaytarılır
		return nil, err
	}
	return nil, err
}

// getProgramWeeksHandler proqramın həftəlik məlumatlarını qaytarır
func getProgramWeeksHandler(w http.ResponseWriter, r *http.Request) {
	// Query parametrlərindən programId-ni alırıq
	programId := r.URL.Query().Get("programId")
	if programId == "" {
		http.Error(w, "programId parametri tələb olunur", http.StatusBadRequest)
		return
	}

	// Context-dən user tokenini alırıq (authMiddleware-dən gəlir)
	token := r.Context().Value("userToken").(*auth.Token)
	uid := token.UID

	ctx := context.Background()

	// Firestore-dan sənədi oxuyuruq
	log.Printf("Firestore request for doc: %s", programId)
	
	// RETRY İLƏ ÇAĞIRIŞ
	doc, err := getDocumentWithRetry(ctx, firestoreClient.Collection("user_program_weeks").Doc(programId))
	
	if err != nil {
		log.Printf("Firestore Get error: %v", err)
		// Sənəd tapılmadıqda 404 qaytar
		if strings.Contains(err.Error(), "NotFound") {
			http.Error(w, "Proqram tapılmadı", http.StatusNotFound)
			return
		}
		http.Error(w, fmt.Sprintf("Firestore xətası: %v", err), http.StatusInternalServerError)
		return
	}

	var data ProgramWeeksDoc
	if err := doc.DataTo(&data); err != nil {
		log.Printf("DataTo error: %v", err)
		// Fallback: Try to load into map to see what fields are problematic
		var rawData map[string]interface{}
		if err2 := doc.DataTo(&rawData); err2 == nil {
			log.Printf("Raw data loaded successfully (for debug): %+v", rawData)
			
			// Xüsusilə 'weeks' sahəsini yoxlayaq
			if weeksVal, ok := rawData["weeks"]; ok {
				log.Printf("'weeks' sahəsinin tipi: %T", weeksVal)
				log.Printf("'weeks' sahəsinin dəyəri: %+v", weeksVal)
			} else {
				log.Printf("'weeks' sahəsi tapılmadı!")
			}
		}
		http.Error(w, fmt.Sprintf("Data parse xətası: %v", err), http.StatusInternalServerError)
		return
	}

	// Təhlükəsizlik yoxlaması: Bu proqram həqiqətən bu istifadəçiyə aiddir?
	if data.UserID != uid {
		http.Error(w, "Bu məlumatı görmək üçün icazəniz yoxdur", http.StatusForbidden)
		return
	}

	// Proqramın əlavə məlumatlarını (məs: name) user_programs-dan çəkirik
	progDoc, err := firestoreClient.Collection("user_programs").Doc(programId).Get(ctx)
	if err == nil {
		if progData := progDoc.Data(); progData != nil {
			if name, ok := progData["name"].(string); ok {
				data.Name = name
			}
		}
	} else {
		log.Printf("Program info fetch error (skipping name): %v", err)
	}

	// ----------------------------------------------------------------------
	for weekKey, weekItems := range data.Weeks {
		for i, item := range weekItems {
			if len(item.Images) > 0 {
				var cleanImages []string
				for _, img := range item.Images {
					// Backtick (`), tek tırnak ('), çift tırnak (") ve boşlukları temizle
					cleanImg := strings.Trim(img, " `\"'")
					if cleanImg != "" {
						cleanImages = append(cleanImages, cleanImg)
					}
				}
				// Temizlenmiş listeyi geri ata
				data.Weeks[weekKey][i].Images = cleanImages
			}
		}
	}
	// ----------------------------------------------------------------------

	// JSON olaraq qaytarırıq
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, fmt.Sprintf("JSON encode xətası: %v", err), http.StatusInternalServerError)
	}
}

// getWorkoutPlanHandler məşq planını və detallarını qaytarır
func getWorkoutPlanHandler(w http.ResponseWriter, r *http.Request) {
	workoutId := r.URL.Query().Get("workoutId")
	log.Printf("getWorkoutPlanHandler CALLED with workoutId: %s", workoutId)

	if workoutId == "" {
		http.Error(w, "workoutId parametri tələb olunur", http.StatusBadRequest)
		log.Println("Error: workoutId is empty")
		return
	}

	ctx := context.Background()
	log.Printf("Fetching workout plan for ID: %s", workoutId)

	// 1. Məşq planını 'workout_programs' və ya fallback olaraq 'workouts' kolleksiyasından tapırıq
	var planDoc *firestore.DocumentSnapshot
	var err error

	log.Println("Checking 'workout_programs' collection...")
	planDoc, err = getDocumentWithRetry(ctx, firestoreClient.Collection("workout_programs").Doc(workoutId))
	
	if err != nil || !planDoc.Exists() {
		log.Printf("Not found in 'workout_programs' (err: %v). Checking 'workouts'...", err)
		// Fallback: 'workouts' kolleksiyasını yoxla
		planDoc, err = getDocumentWithRetry(ctx, firestoreClient.Collection("workouts").Doc(workoutId))
	}

	if err != nil || !planDoc.Exists() {
		log.Printf("Workout plan not found in either collection for ID: %s", workoutId)
		http.Error(w, "Workout plan not found", http.StatusNotFound)
		return
	}

	planData := planDoc.Data()
	log.Printf("Plan data found. Raw data keys: %v", getKeys(planData))

	workoutName, _ := planData["name"].(string)
	if workoutName == "" {
		workoutName, _ = planData["title"].(string)
	}
	if workoutName == "" {
		workoutName = "Workout"
	}
	log.Printf("Workout Name: %s", workoutName)

	// 2. Hərəkətlərin siyahısını alırıq
	rawExercises, ok := planData["exercises"].([]interface{})
	if !ok {
		// Ola bilər exercises sahəsi yoxdur
		log.Println("Warning: 'exercises' field is missing or not an array")
		rawExercises = []interface{}{}
	}
	log.Printf("Found %d exercises in plan", len(rawExercises))

	var detailedExercises []ExerciseDetail

	// 3. Hər bir hərəkət üçün 'workouts' kolleksiyasından detalları çəkirik
	for i, rawEx := range rawExercises {
		exMap, ok := rawEx.(map[string]interface{})
		if !ok {
			continue
		}

		exName, _ := exMap["name"].(string)
		log.Printf("Processing exercise #%d: %s", i, exName)
		
		if exName == "" {
			continue
		}

		// Plandan gələn reps/sets
		reps := exMap["reps"]
		sets := exMap["sets"]

		// Detalları 'workouts' kolleksiyasından axtarırıq (name sahəsinə görə)
		iter := firestoreClient.Collection("workouts").Where("name", "==", exName).Limit(1).Documents(ctx)
		docSnaps, err := iter.GetAll()
		
		var detail ExerciseDetail
		
		if err == nil && len(docSnaps) > 0 {
			// Detalları tapdıq
			if err := docSnaps[0].DataTo(&detail); err != nil {
				log.Printf("Error parsing exercise detail for %s: %v", exName, err)
			} else {
				log.Printf("Fetched details for %s (VideoURL present: %v)", exName, detail.VideoURL != "")
				
				// Clean muscle group images
				if len(detail.MuscleGroups) > 0 {
					for i, mg := range detail.MuscleGroups {
						if mg.ImageURL != "" {
							detail.MuscleGroups[i].ImageURL = strings.Trim(mg.ImageURL, " `\"'")
						}
					}
				}
			}
		} else {
			log.Printf("No details found in 'workouts' collection for exercise: %s", exName)
		}

		// Merge logic: Plan data overrides template data if present, otherwise use template
		finalDetail := ExerciseDetail{
			Name:         exName,
			Reps:         reps,
			Sets:         sets,
			VideoURL:     detail.VideoURL,
			MuscleGroups: detail.MuscleGroups,
			MainImage:    detail.MainImage,
			ImageURL:     detail.ImageURL,
			Instructions: detail.Instructions,
		}
		
		// Əgər planda reps/sets yoxdursa və template-də varsa, ondan istifadə et
		if finalDetail.Reps == nil { finalDetail.Reps = detail.Reps }
		if finalDetail.Sets == nil { finalDetail.Sets = detail.Sets }

		detailedExercises = append(detailedExercises, finalDetail)
	}

	response := WorkoutPlanResponse{
		Name:      workoutName,
		Exercises: detailedExercises,
	}

	log.Printf("Sending response with %d exercises", len(detailedExercises))
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("JSON encode error: %v", err)
		http.Error(w, fmt.Sprintf("JSON encode xətası: %v", err), http.StatusInternalServerError)
	}
}

func getKeys(m map[string]interface{}) []string {
    keys := make([]string, 0, len(m))
    for k := range m {
        keys = append(keys, k)
    }
    return keys
}

// secureDataHandler yalnız doğrulanan istifadəçilərə məlumat qaytarır
func secureDataHandler(w http.ResponseWriter, r *http.Request) {
	// Bura yalnız token-i düzgün olanlar girə bilər!
	// Gələcəkdə burada Firestore-dan məlumat çəkəcəyik
	fmt.Fprintf(w, "Təbrik edirik! Siz Firebase ilə təsdiqlənmiş istifadəçisiniz. Budur sizin gizli məlumatlarınız.")
}

func main() {
	// 1. Firebase üçün context yaradırıq
	ctx := context.Background()

	// 2. Service Account faylımızı göstəririk
	opt := option.WithCredentialsFile("serviceAccountKey.json")

	// 3. Firebase Tətbiqini inisializasiya edirik
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("Firebase inisializasiya xətası: %v\n", err)
	}

	// 4. Firebase Auth klientini yaradırıq (Token yoxlamaq üçün)
	firebaseAuth, err = app.Auth(ctx)
	if err != nil {
		log.Fatalf("Firebase Auth xətası: %v\n", err)
	}

	// 5. Firestore klientini yaradırıq (Məlumat bazası üçün)
	firestoreClient, err = app.Firestore(ctx)
	if err != nil {
		log.Fatalf("Firestore xətası: %v\n", err)
	}
	defer firestoreClient.Close()

	fmt.Println("Firebase (Auth və Firestore) uğurla qoşuldu!")

	// Rotalar (Routes)
	// Açıq rota (Token tələb etmir)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "GreenFit Go Backend işləyir! (Açıq səhifə)")
	})

	// Qorunan rota (Token TƏLƏB edir)
	http.HandleFunc("/api/data", authMiddleware(secureDataHandler))

	// YENİ: Proqram həftələrini gətirən rota
	http.HandleFunc("/api/program-weeks", authMiddleware(getProgramWeeksHandler))

	// YENİ: Məşq planını və detallarını gətirən rota
	http.HandleFunc("/api/workout-plan", authMiddleware(getWorkoutPlanHandler))

	fmt.Println("Server http://localhost:8080 ünvanında dinləyir...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
