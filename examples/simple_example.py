from whatsappbot import Bot
from whatsappbot.auth import LocalProfileAuth

import numpy as np
import asyncio
import cv2
import os

auth = LocalProfileAuth(os.path.abspath("./data_dir"))
bot = Bot(auth)

async def display_image(qr):
    image = cv2.imdecode(np.frombuffer(qr, np.uint8), 1)
    cv2.imshow("Scan in Whatsapp", image)
    while cv2.getWindowProperty('Scan in Whatsapp', 0) >= 0:
        cv2.waitKey(100)
        await asyncio.sleep(0.1)

@bot.event("on_start")
def on_start():
    print("Bot has started.")

@bot.event("on_qr")
def on_qr(qr):
    print("QR scan is required to sign in.")
    asyncio.create_task(display_image(qr))

@bot.event("on_logged_in")
def on_logged_in():
    print("Bot has successfully logged in!")
    cv2.destroyAllWindows()
    messages = bot.get_recent_messages("switzerland")
    for message in messages:
        print(message.as_string())
    bot.stop()

bot.start()
