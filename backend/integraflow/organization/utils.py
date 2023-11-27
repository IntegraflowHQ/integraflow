def get_invite_details(invite_link: str):
    parts = invite_link.split("/")[-3:]
    if len(parts) < 3:
        return []

    if "accept" in parts:
        return [parts[1]]

    return [parts[0], parts[2]]
