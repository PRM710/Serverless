import boto3
import logging
import os

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def send_email(event, context):
    sender = os.environ['SES_FROM_EMAIL']  # Access environment variable securely
    recipient = event.get('recipient')
    subject = event.get('subject')
    body_text = event.get('body_text')

    # Basic input validation
    if not all([recipient, subject, body_text]):
        logger.error("Missing required fields: recipient, subject, or body_text")
        return {
            'statusCode': 400,
            'body': 'Missing required information for sending email.'
        }

    try:
        ses_client = boto3.client("ses")
        response = ses_client.send_email(
            Source=sender,
            Destination={
                'ToAddresses': [recipient]
            },
            Message={
                'Subject': {
                    'Data': subject
                },
                'Body': {
                    'Text': {
                        'Data': body_text
                    }
                }
            }
        )
        logger.info(f"Email sent successfully. Message ID: {response['MessageId']}")
        return {
            'statusCode': 200,
            'body': 'Email sent successfully.'
        }
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return {
            'statusCode': 500,
            'body': 'An error occurred while sending email.'
        }
