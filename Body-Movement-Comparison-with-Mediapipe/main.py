from create_moves import create_move
from error_calculation import error_accuracy_calculation
from move_comparison import compare_positions
from extract_moves import extract_pose_data

benchmark_video = 'dance_videos/benchmark_dance.mp4'
user_video = 'dance_videos/test1.mp4'
extract_video = 'dance_videos/baby_shark_easy.mp4' # replace with 0 for webcam


# compare_positions(benchmark_video, user_video)

# create-move
# create_move('Move 1')

extract_pose_data(extract_video)

# error_accuracy_calculation(benchmark_video, 30, user_video, 30)
# error_accuracy_calculation(benchmark_video, 30, user_video, 30, ) 
# error_accuracy_calculation(benchmark_video, 30, user_video, 30, ) 
# error_accuracy_calculation(benchmark_video, 30, user_video, 30, ) 
# error_accuracy_calculation(benchmark_video, 30, user_video, 30, ) 
