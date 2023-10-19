from opentracing import tags, global_tracer


def traced_payload_generator(func):
    def wrapper(*args, **kwargs):
        operation = f"{func.__name__}"
        with global_tracer().start_active_span(operation) as scope:
            span = scope.span
            span.set_tag(tags.COMPONENT, "payloads")
            return func(*args, **kwargs)

    return wrapper
