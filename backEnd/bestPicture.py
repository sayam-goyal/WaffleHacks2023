import cv2 as cv
from fer import FER
from google.cloud import storage
import firebase_admin
from firebase_admin import credentials, db
import os
from transformers import pipeline
import time

cred = credentials.Certificate('/home/a25ra0631/waffleHacks/waffle-hacks-2023-6dea4-firebase-adminsdk-7ezwp-14170afeeb.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://waffle-hacks-2023-6dea4-default-rtdb.firebaseio.com/'
})
ref = db.reference('')

converter = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")

fr = FER(mtcnn=True)
bucketName = 'waffle-hacks-2023-6dea4.appspot.com'
storageClient = storage.Client()
def readFiles(bucketName):
    ret = []
    for file in storageClient.bucket(bucketName).list_blobs(prefix="video"):
        ret.append(os.path.splitext(file.name)[0])
        content = file.download_as_bytes()
        with open(os.path.join(os.getcwd(), file.name), 'wb') as write:
            write.write(content)
        file.delete()
    return ret

while True:
    files = readFiles(bucketName)
    if len(files) == 0:
        print("Finished files")
    else:
        print("Working on files")
    for file in files:
        place = os.path.join(os.getcwd(), file+".webm")
        cam = cv.VideoCapture(place)
        os.remove(place)
        best = []
        prev = -1
        x = 0
        while cam.isOpened():
            x+=1
            ret, img = cam.read()
            if not ret:
                break
            if x%5 == 0:
                faces = fr.detect_emotions(img)
                sum = 0
                for face in faces:
                    sum+=face['emotions']['happy']
                if sum > prev:
                    best = img
                    prev = sum
        if prev == -1:
            storageClient.bucket(bucketName).blob("image"+file[5:]+".jpg").upload_from_filename(os.path.join(os.getcwd(), "unable.jpg"))
        else:
            filePath = os.path.join(os.getcwd(), file+".jpg")
            cv.imwrite(filePath, best)
            url = "image"+file[5:]
            storageClient.bucket(bucketName).blob(url+".jpg").upload_from_filename(filePath)
            text = converter(filePath)[0]['generated_text']
            ref.set({url+"!jpg": text})
            os.remove(filePath)
    time.sleep(1)