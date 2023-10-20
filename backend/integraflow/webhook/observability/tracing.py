from contextlib import contextmanager

from opentracing import tags, global_tracer


@contextmanager
def opentracing_trace(span_name, component):
    with global_tracer().start_active_span(
        f"observability.{span_name}"
    ) as scope:
        span = scope.span
        span.set_tag("service.name", "observability")
        span.set_tag(tags.COMPONENT, component)
        yield
