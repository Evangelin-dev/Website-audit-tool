from celery import shared_task


@shared_task
def run_audit(task_id: str, url: str):
    """Deprecated: Audit analysis now runs synchronously."""
    return {
        'status': 'deprecated',
        'message': 'Use the synchronous API endpoint instead'
    }

