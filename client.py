import smtplib
from email.message import EmailMessage
def send_mail(to_email, subject, message, server='localhost',
              from_email='xx@example.com'):
    # import smtplib
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = ', '.join(to_email)
    msg.set_content(message)
    print(msg)
    server = smtplib.SMTP(server,1027)
    server.set_debuglevel(1)
    server.login(from_email, 'password')  # user & password
    server.send_message(msg)
    server.quit()
    print('successfully sent the mail.')
    
send_mail(to_email=['test@gmail.com', '12345@126.com'],
          subject='hello', message='Your analysis has done hello hello lorem upsum!')