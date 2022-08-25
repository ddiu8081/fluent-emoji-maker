sudo proxychains4 gcloud builds submit --tag gcr.io/text-sticker-maker-c4368/emoji-maker
proxychains4 gcloud beta run deploy emoji-maker --image gcr.io/text-sticker-maker-c4368/emoji-maker --platform=managed --region=us-central1
