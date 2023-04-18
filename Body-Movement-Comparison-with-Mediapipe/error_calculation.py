import json
import os
import cv2, time
import pose_module as pm
from scipy.spatial.distance import cosine
from fastdtw import fastdtw
import numpy as np

def error_accuracy_calculation(benchmark_video,benchmark_frame_rate, user_video,user_frame_rate):
    benchmark_cam = cv2.VideoCapture(benchmark_video)
    user_cam = cv2.VideoCapture(user_video)
    fps_time = 0 #Initializing fps to 0
    detector_1 = pm.poseDetector()
    detector_2 = pm.poseDetector()
    frame_group_counter = 0
    body_part_list = ["wb","ra","la","rl","ll"]
    total_correct_average_frames_byFG = dict()
    error_data = dict()
    accuracy_data = dict()
    for body_part in body_part_list:
        total_correct_average_frames_byFG[body_part] = 0
        error_data[body_part] = []
        accuracy_data[body_part] = []
    #initialize data
    total_lmList_user = dict()
    total_lmList_benchmark = dict()
    for body_part in body_part_list:
        total_lmList_user[body_part] = None
        total_lmList_benchmark[body_part] = None
    history_lmList_user = []
    history_lmList_benchmark = []
    last_valid_position_lmList_user = []
    last_valid_position_lmList_benchmark = []

    ratio = benchmark_frame_rate/user_frame_rate
    print(ratio)
    frame_group = 5
    wl_counter = 0
    print("user_cam total frame = {}".format(user_cam.get(cv2.CAP_PROP_FRAME_COUNT)))
    print("benchmark_cam total frame = {}".format(benchmark_cam.get(cv2.CAP_PROP_FRAME_COUNT)))
    while((benchmark_cam.isOpened() or user_cam.isOpened()) and wl_counter < (user_cam.get(cv2.CAP_PROP_FRAME_COUNT) - 4)):
        try:
            average_lmList_user = dict()
            average_lmList_benchmark = dict()
            if frame_group_counter == 0:

                # extract user_cam data by frame_group
                for i in range(int(frame_group)):
                    ret_val, image_1 = user_cam.read()
                    image_1 = cv2.resize(image_1,(720,640))
                    image_1 = detector_1.findPose(image_1)
                    lmList_user_positions = detector_1.findPosition(image_1)
                    if len(lmList_user_positions) == 0:
                        lmList_user_positions = last_valid_position_lmList_user
                    last_valid_position_lmList_user = lmList_user_positions
                    # lmList_user = choose_landmarks(lmList_user, body_part)
                    lmList_user = dict()
                    for body_part in body_part_list:
                        lmList_user[body_part] = choose_landmarks(lmList_user_positions,body_part)
                        total_lmList_user[body_part] = total_body_part_landmarks_data(total_lmList_user[body_part], lmList_user[body_part])
                    history_lmList_user.append(lmList_user)

                for body_part in body_part_list:
                    average_lmList_user[body_part] = average_body_part_landmarks_data(total_lmList_user[body_part],frame_group)

                # extract benchmark_cam data by frame_group
                for i in range (int(frame_group * ratio)):
                    ret_val_1, image_2 = benchmark_cam.read()
                    image_2 = cv2.resize(image_2,(720,640))
                    image_2 = detector_2.findPose(image_2)
                    lmList_benchmark_positions = detector_2.findPosition(image_2)
                    if len(lmList_benchmark_positions) == 0:
                        lmList_benchmark_positions = last_valid_position_lmList_benchmark
                    last_valid_position_lmList_benchmark = lmList_benchmark_positions                    
                    lmList_benchmark = dict()
                    for body_part in body_part_list:
                        lmList_benchmark[body_part] = choose_landmarks(lmList_benchmark_positions,body_part)
                        total_lmList_benchmark[body_part] = total_body_part_landmarks_data(total_lmList_benchmark[body_part], lmList_benchmark[body_part])
                    history_lmList_benchmark.append(lmList_benchmark)
                    
                for body_part in body_part_list:
                    average_lmList_benchmark[body_part] = average_body_part_landmarks_data(total_lmList_benchmark[body_part],frame_group)
            else:
                # extract user_cam data by next
                # print("be4 read")
                ret_val, image_1 = user_cam.read()
                # print("after read")
                image_1 = cv2.resize(image_1,(720,640))
                # print("after read2")

                image_1 = detector_1.findPose(image_1)
                # print("after read3")

                lmList_user_positions = detector_1.findPosition(image_1)
                # if len(lmList_user_positions) < 33:
                #     print(lmList_user_positions)
                if len(lmList_user_positions) == 0:
                    lmList_user_positions = last_valid_position_lmList_user
                last_valid_position_lmList_user = lmList_user_positions
                # print("after read4")

                # lmList_user = choose_landmarks(lmList_user, body_part)
                lmList_user = dict()
                # print("after read5")

                for body_part in body_part_list:
                    # print("after read6")

                    lmList_user[body_part] = choose_landmarks(lmList_user_positions,body_part)
                    # print("after read7")

                    total_lmList_user[body_part] = total_body_part_landmarks_data(total_lmList_user[body_part], lmList_user[body_part]) - np.array(history_lmList_user[0][body_part])
                    # print("after read8")

                history_lmList_user.pop(0)
                # print("after read9")

                history_lmList_user.append(lmList_user)
                # print("after read10")


                
                for body_part in body_part_list:
                    average_lmList_user[body_part] = average_body_part_landmarks_data(total_lmList_user[body_part],frame_group)
                # print("be4 extract")
                
                # extract benchmark_cam data by next
                ret_val_1, image_2 = benchmark_cam.read()
                image_2 = cv2.resize(image_2,(720,640))
                image_2 = detector_2.findPose(image_2)
                lmList_benchmark_positions = detector_2.findPosition(image_2)
                if len(lmList_benchmark_positions) < 33:
                    print("error benchmark frame: " , lmList_benchmark_positions)
                if len(lmList_benchmark_positions) == 0:
                    lmList_benchmark_positions = last_valid_position_lmList_benchmark
                last_valid_position_lmList_benchmark = lmList_benchmark_positions                                     
                lmList_benchmark = dict()
                for body_part in body_part_list:
                    lmList_benchmark[body_part] = choose_landmarks(lmList_benchmark_positions,body_part)
                    total_lmList_benchmark[body_part] = total_body_part_landmarks_data(total_lmList_benchmark[body_part], lmList_benchmark[body_part]) - np.array(history_lmList_benchmark[0][body_part])
                history_lmList_benchmark.pop(0)
                history_lmList_benchmark.append(lmList_benchmark)

                for body_part in body_part_list:
                    average_lmList_benchmark[body_part] = average_body_part_landmarks_data(total_lmList_benchmark[body_part],frame_group)

                # print("be4 comparason")
            # comparison
            frame_group_counter += 1
            if ret_val_1 or ret_val:
                error = dict()
                total_fg_accuracy = dict()
                new_total_correct_average_frames_byFG = dict()
                for body_part in body_part_list:
                    error[body_part], total_fg_accuracy[body_part], new_total_correct_average_frames_byFG[body_part] = error_accuracy_data(average_lmList_user[body_part], average_lmList_benchmark[body_part], total_correct_average_frames_byFG[body_part], frame_group_counter)
                    total_correct_average_frames_byFG[body_part] = new_total_correct_average_frames_byFG[body_part]
                    error_data[body_part].append(error[body_part])
                    accuracy_data[body_part].append(total_fg_accuracy[body_part])
                wl_counter += 1
                # print(wl_counter)
            else:
              
                print("error :" + wl_counter)
                break
        except Exception as e:
            wl_counter += 1
            print(wl_counter)
            print(e)
            continue
    file_name = user_video.replace('dance_videos/','')
    file_name = file_name.replace('.mp4','')
    for body_part in body_part_list:
        create_file(file_name, body_part, error_data[body_part], accuracy_data[body_part])
    benchmark_cam.release()
    user_cam.release()
    
def write_json(target_path, target_file, data):
    if not os.path.exists(target_path):
        try:
            os.makedirs(target_path)
        except Exception as e:
            print(e)
            raise
    with open(os.path.join(target_path, target_file), 'w') as f:
        json.dump(data, f)

def choose_landmarks(lmList, part):
    if len(lmList) == 0:
        return np.array(lmList)
    if part == "wb":
        wb_lmList = np.array(lmList)
        return wb_lmList
    elif part == "ra":
        ra_lmList = np.array([lmList[14],lmList[16],lmList[18],lmList[20],lmList[22]]) - np.array(lmList[12])
        return ra_lmList
    elif part == "la":
        la_lmList = np.array([lmList[13],lmList[15],lmList[17],lmList[19],lmList[21]]) - np.array(lmList[11])
        return la_lmList
    elif part == "rl":
        rl_lmList = np.array([lmList[26],lmList[28],lmList[30],lmList[32]]) - np.array(lmList[24])
        return rl_lmList
    elif part == "ll":
        ll_lmList = np.array([lmList[25],lmList[27],lmList[29],lmList[31]]) - np.array(lmList[23])
        return ll_lmList
    

def total_body_part_landmarks_data(total_part_lmList, part_lmList):
    if total_part_lmList is None:
        total_part_lmList = np.array(part_lmList)
    else:
        total_part_lmList += np.array(part_lmList)
    return total_part_lmList

def average_body_part_landmarks_data(total_part_lmList, total_group_frame):
    average_part_lmList = (total_part_lmList / total_group_frame).tolist()
    return average_part_lmList

def error_accuracy_data(average_part_lmList_user, average_part_lmList_benchmark,total_part_correct_average_frame_byFG,fg_counter):
    part_error, path = fastdtw(average_part_lmList_user,average_part_lmList_benchmark,dist=cosine)
    if part_error < 0.3:
        total_part_correct_average_frame_byFG += 1
    # print(part_error)
    # print("fg_counter: " + fg_counter)
    total_part_fg_accuracy = round(100*total_part_correct_average_frame_byFG/fg_counter, 2)
    return (part_error, total_part_fg_accuracy , total_part_correct_average_frame_byFG)         

def create_file(filename, part_name, error_data, accuracy_data):
    error_file_name = "{}_{}_error.json".format(filename, part_name)
    accuracy_file_name ="{}_{}_accuracy.json".format(filename, part_name)
    write_json('sample_data', error_file_name, error_data)
    write_json('sample_data', accuracy_file_name, accuracy_data)
    return
