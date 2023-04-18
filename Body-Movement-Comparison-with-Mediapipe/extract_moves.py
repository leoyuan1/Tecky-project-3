import os
import cv2, time
import pose_module as pm
from scipy.spatial.distance import cosine
from fastdtw import fastdtw
from error_calculation import choose_landmarks
import json

def extract_pose_data(benchmark_video:str):
    fps_time = 0 #Initializing fps to 0
    detector = pm.poseDetector()
    frame_counter = 0
    benchmark_cam = cv2.VideoCapture(benchmark_video)
    if (benchmark_cam.isOpened()==False):
        print("Error opening video stream or file")
    body_part_list = ["wb","ra","la","rl","ll"]
    pose_data = dict()
    for body_part in body_part_list:
        pose_data[body_part] = []
    last_valid_position_lmList= []
    while (benchmark_cam.isOpened() and frame_counter < (benchmark_cam.get(cv2.CAP_PROP_FRAME_COUNT))):
        try:
            frameData = dict()	
            ret_val,image = benchmark_cam.read()
            if ret_val == True:
                image = detector.findPose(image)
                lmList = detector.poseData(image)
                if len(lmList) == 0:
                    lmList = last_valid_position_lmList
                last_valid_position_lmList = lmList                
                for body_part in body_part_list:
                    frameData[body_part] = choose_landmarks(lmList,body_part)
                    pose_data[body_part].append(frameData[body_part].tolist())
            frame_counter += 1
            print(frame_counter)
        except Exception as e:
            frame_counter += 1
            print(frame_counter)
            print(e)
            continue
        # if ret_val == True:
        # 	image = detector.findPose(image)
        # 	lmList = detector.poseData(image)
        # 	rameData.append(lmList)
        # 	pose_data.append(frameData)
        # else:
        # 	break
    # dictionary = {"details": pose_data}
    # file_name = "{}.json".format(benchmark_video.replace('dance_videos/',''))
    # print(file_name)
    # # write_json('sample_data', file_name, dictionary)
    # write_json('benchmark_video_data', file_name, pose_data)
    file_name = benchmark_video.replace('dance_videos/','')
    file_name = file_name.replace('.mp4','')
    for body_part in body_part_list:
        create_file(file_name, body_part, pose_data[body_part])        
    benchmark_cam.release()

def write_json(target_path, target_file, data):
    if not os.path.exists(target_path):
        try:
            os.makedirs(target_path)
        except Exception as e:
            print(e)
            raise
    with open(os.path.join(target_path, target_file), 'w') as f:
        json.dump(data, f)

def create_file(filename, part_name, data):
    file_name = "{}_{}_data.json".format(filename, part_name)
    write_json('benchmark_video_data', file_name, data)

    
