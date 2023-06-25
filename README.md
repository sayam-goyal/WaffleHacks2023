# Snap Planner
## Inspiration
We realized that a lot of online travel planners do not have a lot of functionality and have way too many options so we wanted to tone it down and added better and easier features. Additionally, when taking photos we always struggled with finding the best photo we liked. So we created this smart camera that takes a photo when it knows you look your best!
## What it does
It will help you plan your travels like picking a place, finding things do do/eat and make a schedule, and will help you take pictures on the way using AI. Using hugging face models and facial emotion recognition, our backend takes the best photo possible for you and captions it as well so you can post it straight to your favorite social media! We hope to revolutionize the industry by ensuring that people always look their best in photos instead of retaking photos hundreds of times. Snap Planner is the future of travel using AI to make your experience smoother so you can focus on the more important things while traveling.
## How we built it
We used React as our front end and the google maps API to get a map on the website. We used firebase as our storage and then used the realtime database to let our frontend listen to changes in the storage and then finally python as the backend code. We used a model from hugging face to caption the image and FER to get the best image.
## Challenges we ran into
We had a hard time using firebase and google maps API since it was our first time using it. This was also our first time using React so we ran into a lot of problems trying to use hooks and other functions. We were also unable to complete the full project vision but hope to continue it after the hackathon.
## Accomplishments that we're proud of
We were able to make a good image taker that does not rely on a countdown timer, instead it takes the best picture on its own using AI. Although we did not finish the schedule and estimated cost, we hope to work on it in the future.
## What we learned
We learnt how to use Firebase, React and use the two to combine the frontend and backend.
## What's next for Travel Planner
We want to finish our activities page and our schedule/total cost page. We also want to make it allow you to guide you on the trip while you are there.
