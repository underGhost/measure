import numpy as np
import cv2
import sys
import time
import logging
from picamera.array import PiRGBArray
from picamera import PiCamera

camera = PiCamera()
camera.resolution = (640, 480)
camera.framerate = 60
rawCapture = PiRGBArray(camera, size=(640, 480))
time.sleep(1)

sigma = 0.33

def nothing(x):
	pass

for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
	img = frame.array
	v = np.median(img)
	imgray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	imgray = cv2.GaussianBlur(imgray, (41, 41), 0)
	high_thresh, thresh = cv2.threshold(imgray, 75, 200, cv2.THRESH_BINARY_INV)
	thresh = cv2.dilate(thresh, None, iterations=2)
	lower = max(0, (1.0 - sigma) * v)
	upper = min(255, (1.0 + sigma) * v)
	edges = cv2.Canny(img, lower, upper)
	contours, hierarchy = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

	for cnt in contours:
		x,y,w,h = cv2.boundingRect(cnt)
		rect = cv2.minAreaRect(cnt)
		box = cv2.cv.BoxPoints(rect)
		box = np.int0(box)
		cv2.drawContours(img, [box], 0, (0, 255, 0), 3)
		cv2.imwrite('demo.jpg', img)
       		print(w + 2)
        	print(h + 2)
	rawCapture.truncate(0)
	#cv2.imshow('demo', img)
	#if(cv2.waitKey(1) & 0xFF == ord('q')):
	break
