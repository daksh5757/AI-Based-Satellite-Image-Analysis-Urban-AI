import requests

url = "http://127.0.0.1:5000/analyze"
image_path = "test_image.jpg"  # make sure you have this image in same folder

with open(image_path, "rb") as img:
    files = {"image": img}
    response = requests.post(url, files=files)

print(response.json())
