import cv2
import mediapipe as mp
import random
import time
import threading
import tkinter as tk
from tkinter import messagebox

# Hand tracking setup
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Gesture Detection Logic
def get_hand_gesture(hand_landmarks):
    finger_tips_ids = [8, 12, 16, 20]
    fingers = []

    if hand_landmarks.landmark[4].x < hand_landmarks.landmark[3].x:
        fingers.append(1)
    else:
        fingers.append(0)

    for tip_id in finger_tips_ids:
        if hand_landmarks.landmark[tip_id].y < hand_landmarks.landmark[tip_id - 2].y:
            fingers.append(1)
        else:
            fingers.append(0)

    total_fingers = fingers.count(1)

    if total_fingers == 0:
        return "Rock"
    elif total_fingers == 2 and fingers[1] == 1 and fingers[2] == 1:
        return "Scissors"
    elif total_fingers >= 4:
        return "Paper"
    else:
        return "Unknown"

def get_winner(user_move, computer_move):
    if user_move == computer_move:
        return "Draw"
    elif (user_move == "Rock" and computer_move == "Scissors") or \
         (user_move == "Scissors" and computer_move == "Paper") or \
         (user_move == "Paper" and computer_move == "Rock"):
        return "User"
    else:
        return "Computer"

# Main game function in a separate thread
def play_game():
    cap = cv2.VideoCapture(0)
    hands = mp_hands.Hands(max_num_hands=1)

    round_number = 1
    user_score = 0
    computer_score = 0

    while round_number <= 5:
        user_move = "Waiting..."
        computer_move = "Thinking..."
        winner = ""

        print(f"\n🕹️ Round {round_number}: Show your move in the next 3 seconds!")
        start_time = time.time()
        detected = False

        while time.time() - start_time < 3:
            success, frame = cap.read()
            if not success:
                continue

            frame = cv2.flip(frame, 1)
            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(image_rgb)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    user_move = get_hand_gesture(hand_landmarks)
                    detected = True
                    mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            cv2.putText(frame, f'Round: {round_number}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (100, 255, 100), 2)
            cv2.putText(frame, f'Your Move: {user_move}', (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

            cv2.imshow("Rock Paper Scissors - Tracking", frame)
            if cv2.waitKey(1) & 0xFF == 27:
                break

        if not detected:
            user_move = "Unknown"

        computer_move = random.choice(["Rock", "Paper", "Scissors"])
        winner = get_winner(user_move, computer_move)

        if winner == "User":
            user_score += 1
        elif winner == "Computer":
            computer_score += 1

        print(f"👤 You played: {user_move}")
        print(f"🤖 Computer played: {computer_move}")
        print(f"🏆 Round Winner: {winner}")

        result_frame = frame.copy()
        cv2.putText(result_frame, f'Computer Move: {computer_move}', (10, 110), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
        cv2.putText(result_frame, f'Round Winner: {winner}', (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 100, 255), 3)
        cv2.imshow("Rock Paper Scissors - Round Result", result_frame)
        cv2.waitKey(2000)

        round_number += 1

    print("\n🎯 Match Over!")
    if user_score > computer_score:
        match_result = f"✅ You won the match! ({user_score} - {computer_score})"
    elif user_score < computer_score:
        match_result = f"❌ You lost the match! ({user_score} - {computer_score})"
    else:
        match_result = f"🤝 Match Draw! ({user_score} - {computer_score})"

    print(match_result)

    final_frame = frame.copy()
    cv2.putText(final_frame, f'Final Score - You: {user_score} | Comp: {computer_score}', (10, 80),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(final_frame, match_result, (10, 130), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 0, 0), 3)
    cv2.imshow("Final Result", final_frame)
    cv2.waitKey(3000)

    cap.release()
    cv2.destroyAllWindows()

# GUI functions
def start_game():
    threading.Thread(target=play_game, daemon=True).start()

def exit_game():
    if messagebox.askokcancel("Quit", "Do you want to exit the game?"):
        root.destroy()

# GUI setup
root = tk.Tk()
root.title("Rock Paper Scissors Game")
root.geometry("300x200")

title_label = tk.Label(root, text="🖐️ Rock Paper Scissors", font=("Arial", 16))
title_label.pack(pady=20)

start_button = tk.Button(root, text="Start Game", font=("Arial", 14), command=start_game, bg="green", fg="white")
start_button.pack(pady=10)

exit_button = tk.Button(root, text="Exit", font=("Arial", 14), command=exit_game, bg="red", fg="white")
exit_button.pack()

root.mainloop()
