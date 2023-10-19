from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.views import serve
from django.urls import include, re_path

from integraflow.core.views import jwks

urlpatterns = [
    re_path(r"^\.well-known/jwks.json$", jwks, name="jwks"),
]

if settings.DEBUG:
    import warnings

    try:
        import debug_toolbar
    except ImportError:
        warnings.warn(
            "The debug toolbar was not installed. Ignore the error. \
            settings.py should already have warned the user about it."
        )
    else:
        urlpatterns += [
            re_path(  # type: ignore
                r"^__debug__/",
                include(debug_toolbar.urls), name="debug"
            )
        ]

    urlpatterns += static("/media/", document_root=settings.MEDIA_ROOT) + [
        re_path(r"^static/(?P<path>.*)$", serve),
    ]
