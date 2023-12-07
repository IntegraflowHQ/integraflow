"""
Costs map used by query complexity validator.

It's three levels deep dict of dicts:

- Type
- Fields
- Complexity

To set complexity cost for querying a field "avatar" on type "User":

{
    "User": {
        "avatar": {"complexity": 2}
    }
}

Querying above field will not increase query complexity by 1.

If field's complexity should be multiplied by value of argument (or arguments),
you can specify names of those arguments in "multipliers" list:

{
    "Query": {
        "surveys": {"complexity": 1, "multipliers": ["first", "last"]}
    }
}

This will result in following queries having cost of 100:

{ surveys(first: 100) { edges: { id } } }

{ surveys(last: 100) { edges: { id } } }

{ surveys(first: 10, last: 10) { edges: { id } } }

Notice that complexity in last case is multiplied by all arguments.

Complexity is also multiplied recursively:

{
    "Query": {
        "surveys": {"complexity": 1, "multipliers": ["first", "last"]}
    },
    "Survey": {
        "questions": {"complexity": 1},
    }
}

This query will have cost of 200 (100 x 2 for each survey):

{ surveys(first: 100) { complexity } }
"""

COST_MAP = {
    "Query": {
        "viewer": {"complexity": 1},
        "themes": {"complexity": 1, "multipliers": ["first", "last"]},
        "organizationInviteDetails": {"complexity": 1},
        "organizationInviteLink": {"complexity": 1},
    },
    "User": {
        "organization": {"complexity": 1},
        "project": {"complexity": 1},
        "organizations": {"complexity": 1, "multipliers": ["first", "last"]},
        "projects": {"complexity": 1, "multipliers": ["first", "last"]},
    },
    "AuthUser": {
        "organization": {"complexity": 1},
        "project": {"complexity": 1},
    },
    "AuthOrganization": {
        "memberCount": {"complexity": 1},
    },
    "Organization": {
        "memberCount": {"complexity": 1},
        "members": {"complexity": 1, "multipliers": ["first", "last"]},
        "projects": {"complexity": 1, "multipliers": ["first", "last"]},
    },
    "Project": {
        "organization": {"complexity": 1},
    },
    "ProjectTheme": {
        "project": {"complexity": 1},
        "creator": {"complexity": 1},
    }
}
