import hmac
import re
import subprocess
import threading
from flask import Flask, request

app = Flask(__name__)


def script():
    count = 0
    while count < 5:
        try:
            subprocess.check_output(['sh', '-c', 'cd /root/website && /bin/sh scripts/restart.sh'])
            break
        except subprocess.CalledProcessError as _e:
            count += 1
            continue


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

    threading.Thread(target=script).start()

    return {'code': 200, 'message': 'run script', 'data': None}


def main():
    app.run(host='127.0.0.1', port=8080)


if __name__ == '__main__':
    main()
