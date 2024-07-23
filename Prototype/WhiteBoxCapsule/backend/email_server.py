import smtplib
import ssl
import os
from dotenv import load_dotenv

# Create a secure SSL context

message = """\
Subject: Hi there!

This message is sent from Python."""
context = ssl.create_default_context()
with smtplib.SMTP_SSL(os.environ.get('SMTP_SERVER'), os.environ.get('SMTP_PORT'), context=context) as server:
    server.connect(host=os.environ.get('SMTP_SERVER'), port=os.environ.get('SMTP_PORT'))
    server.login(os.environ.get('EMAIL'), os.environ.get('APP_PASSWORD'))
    message = """\
Subject: Hi there

This message is sent from Python."""

    server.sendmail(os.environ.get('EMAIL'), 'lessthelonely@gmail.com', message)
