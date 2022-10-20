import smtplib
from os.path import basename
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate
import os

def send_mail(send_from, send_to, subject, text, files=None,
              server="127.0.0.1"):
    assert isinstance(send_to, list)

    msg = MIMEMultipart()
    msg['From'] = send_from
    msg['To'] = COMMASPACE.join(send_to)
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject

    msg.attach(MIMEText(text))

    for f in files or []:
        with open(os.path.join(os. getcwd(),'attachments',f), "rb") as fil:
            part = MIMEApplication(
                fil.read(),
                Name=basename(f)
            )
        # After the file is closed
        part['Content-Disposition'] = 'attachment; filename="%s"' % basename(f)
        msg.attach(part)
    smtp = smtplib.SMTP(server,1027)
    smtp.set_debuglevel(0)
    smtp.login(send_from, 'password') 
    smtp.sendmail(send_from, send_to, msg.as_string())
    smtp.close()
    
send_mail(send_from="test@gmail.com",send_to=['12345@qq.com', '12345@126.com'],
          subject='Send email with attachments', text='We are test to send email with attachments!',files=['image.png', 'ppt.pptx', 'filepdf.pdf', 'excel.xlsx'])