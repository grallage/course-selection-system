from rest_framework.views import APIView
from rest_framework.response import Response
import logging
from .. import utils

logger = logging.getLogger(__name__)


class ScheduleSettingView(APIView):
    def get(self, request, format=None):
        response = {
            "week_settings": utils.WEEK_CHOICES,
            "timespan_settings": utils.TIME_CHOICES,
        }
        return Response(response)
