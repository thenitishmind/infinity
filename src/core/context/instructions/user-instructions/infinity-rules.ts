// Infinity-specific user instruction rules
// This file contains rules specific to the Infinity project

export const infinityRules = `
# Infinity Rules

These are the core rules for the Infinity AI coding agent:

1. Always prioritize code quality and maintainability
2. Follow existing code patterns and conventions
3. Be proactive in suggesting improvements
4. Ask for clarification when requirements are unclear
5. Test your code thoroughly before deployment
6. Document your changes clearly
7. Follow security best practices
8. Be mindful of performance implications
`

export default infinityRules

// Stub functions for missing exports
export const getGlobalClineRules = () => {
  return []
}

export const getLocalClineRules = () => {
  return []
}

export const refreshClineRulesToggles = (globalRules: any, localRules: any) => {
  return {
    globalToggles: {},
    localToggles: {}
  }
}