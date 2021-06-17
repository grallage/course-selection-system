from django.db.models import signals
from django.dispatch import receiver

import logging
from . import models

logger = logging.getLogger(__name__)


@receiver(signals.post_save, sender=models.Course)
def bind_student_course(sender, instance, **kwargs):

    count = models.StudentCourse.objects.filter(course=instance).count()

    logger.info(instance.is_compulsory)
    if count == 0 and instance.is_compulsory:
        # original = models.Course.objects.get(pk=instance.id)
        # models.StudentCourse.objects.filter(course=original).delete()
        student_list = models.Student.objects.all().filter(
            class_info=instance.class_info
        )

        for student in student_list:

            models.StudentCourse(student=student, course=instance).save()
