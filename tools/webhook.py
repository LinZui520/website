import hmac
import re
import subprocess
import threading
from flask import Flask, request

app = Flask(__name__)

lock = threading.Lock()
condition = threading.Condition(lock)
count = 0
running = False


def script():
    global count
    global running
    with condition:
        while True:
            condition.wait()
            while count > 0 and not running:
                try:
                    running = True
                    subprocess.check_output(['sh', '-c', 'cd /root/website && /bin/sh scripts/restart.sh'])
                    count = 0
                except subprocess.CalledProcessError as _e:
                    count -= 1
                finally:
                    running = False


@app.route('/api/github/webhook', methods=['POST'])
def webhook():
    body = request.get_data()
    headers = request.headers

    if not body or not headers:
        return {'code': 400, 'message': 'argument error', 'data': None}

    with open('/root/website/nextjs/.env', 'r') as file:
        content = file.read()
        match = re.search(r'GITHUB_WEBHOOK_SECRET="([^"]*)"', content)

    secret = match.group(1)
    signature = headers.get('X-Hub-Signature-256', '')
    digest = 'sha256=' + hmac.new(secret.encode(), body, 'sha256').hexdigest()

    if signature != digest:
        return {'code': 400, 'message': 'signature error', 'data': None}

    global count
    with condition:
        count += 5
        condition.notify()

    return {'code': 200, 'message': 'run script', 'data': None}


@app.before_first_request
def start_script_thread():
    threading.Thread(target=script).start()


def main():
    app.run(host='127.0.0.1', port=8080)


if __name__ == '__main__':
    main()
