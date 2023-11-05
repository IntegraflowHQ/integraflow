import toronado

from lxml import html

from django.conf import settings


def inline_css(value: str) -> str:
    """
    Returns an HTML document with inline CSS.
    Forked from getsentry/sentry
    """
    tree = html.document_fromstring(value)
    if tree is None:
        tree = ""

    toronado.inline(tree)

    # CSS media query support is inconsistent when the DOCTYPE declaration is
    # missing, so we force it to HTML5 here.
    return html.tostring(
        tree,
        doctype="<!DOCTYPE html>",
    ).decode("utf-8")


def is_email_available(with_absolute_urls: bool = False) -> bool:
    """
    Returns whether email services are available on this instance
    (i.e. settings are in place).
    Emails with absolute URLs can't be sent if SITE_URL is unset.
    """
    return (
        bool(settings.EMAIL_HOST)
        and (not with_absolute_urls or settings.SITE_URL is not None)
    )
