from rest_framework.pagination import PageNumberPagination
import logging

logger = logging.getLogger(__name__)


class PageNumberWithPageSizePagination(PageNumberPagination):
    page_size_query_param = "page_size"

    def paginate_queryset(self, queryset, request, view):
        if request.GET.get("get_all", False) == "true":
            return None
        else:
            return super().paginate_queryset(queryset, request, view=view)
