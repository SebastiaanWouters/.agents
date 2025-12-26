---
name: btca
description: Query library/framework source code via btca CLI. Triggers on unfamiliar tech, implementation questions, API usage, version-specific docs. Proactively use to verify solutions against actual code.
---

# btca (Better Context App)

Get answers from actual library source code. Use proactively when encountering unfamiliar tech or verifying implementation details.

## Commands

```bash
btca ask -t <tech> -q "<question>"     # ask about a technology
btca ask -t <tech> -q "<q>" --no-sync  # skip repo update (faster)
btca config repos list                  # see available repos
btca config repos add -n <name> -u <url> [-b <branch>]  # add new repo
```

## When to Use

- Unfamiliar library/framework encountered
- Need implementation details for specific version
- Verify if suggested solution matches library behavior
- Missing repo → add it with `btca config repos add`

## Tips

- Be specific: "How does X implement Y internally?" > "How does X work?"
- Use `--no-sync` for follow-up questions
- Add project dependencies to btca for deeper context
