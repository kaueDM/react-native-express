function formatSlug(string) {
  return string.replace(/ /g, '_').toLowerCase()
}

function createSection(folder, title) {
  if (!title) {
    const slug = formatSlug(`${folder}/index`)
    return { depth: 0, title: folder, slug }
  }

  const slug = formatSlug(`${folder}/${title}`)
  return { depth: 1, title, slug }
}

let sections = [
  {
    hidden: true,
    depth: 0,
    title: 'Learning JavaScript',
    slug: '',
  },

  createSection('Environment'),
  createSection('Environment', 'Quick Start'),

  createSection('Types'),
  createSection('Types', 'Primitive Types'),
  createSection('Types', 'Reference Types'),
  createSection('Types', 'Library Types'),
  createSection('Types', 'Type Names'),

  createSection('Syntax'),
  createSection('Syntax', 'Variables'),
  createSection('Syntax', 'Equality'),

  createSection('Collections'),
  createSection('Collections', 'Arrays'),
  createSection('Collections', 'Objects'),
  createSection('Collections', 'Sets and Maps'),
  createSection('Collections', 'Iteration'),

  createSection('Functions'),
  createSection('Functions', 'Syntax'),
  createSection('Functions', 'Arguments'),
  createSection('Functions', 'Returning'), // No tuples, use arrays & objects
  createSection('Functions', 'Callbacks'),
  createSection('Functions', 'Scope'),
  createSection('Functions', 'Context'),

  createSection('Classes'), // Constructors, instantiation, new & instanceof
  createSection('Classes', 'Properties'), // Getters & setters, default values, static
  createSection('Classes', 'Methods'), // Scope, super
  createSection('Classes', 'Inheritance'), // Super

  createSection('Type Declarations'),
  createSection('Type Declarations', 'Constants'), // Like type = "hello"
  createSection('Type Declarations', 'Enums'),
  createSection('Type Declarations', 'Arrays'), // Cover tuple behavior
  createSection('Type Declarations', 'Objects'),
  createSection('Type Declarations', 'Interfaces'),
  createSection('Type Declarations', 'Unions'), // Including discriminated
  createSection('Type Declarations', 'Generics'),
  createSection('Type Declarations', 'Type Casting'),
  createSection('Type Declarations', 'Type Guards'),
  createSection('Type Declarations', 'Any and Unknown'),

  createSection('Async Control Flow'), // No threads. Callbacks & promises
  createSection('Async Control Flow', 'Callbacks'),
  createSection('Async Control Flow', 'Event Loop'), // setTimeout, setInterval
  createSection('Async Control Flow', 'Promises'), // setTimeout, setInterval
  createSection('Async Control Flow', 'Async and Await'), // setTimeout, setInterval
  createSection('Async Control Flow', 'Fetch'), // setTimeout, setInterval

  createSection('Exercises'),
  createSection('Exercises', 'A'),
  createSection('Exercises', 'B'),

  // createSection('Syntax', 'Fancy Syntax'),
]

// Add section numbers. I use semver naming, since it's easy to remember
// how the sections should be numbered and arranged: {major}.{minor}.{patch}.
sections = sections.reduce(
  (acc, section) => {
    const { depth, hidden } = section
    let { major, minor, patch, sections } = acc

    if (hidden) {
      sections.push(section)
      return acc
    }

    if (depth === 0) {
      major++
      minor = 0
      patch = 0
    } else if (depth === 1) {
      minor++
      patch = 0
    } else {
      patch++
    }

    sections.push({ ...section, major, minor, patch })

    return { ...acc, major, minor, patch }
  },
  { sections: [], major: 0, minor: 0, patch: 0 }
).sections

// Add {parent} to patch sections
sections = sections.reduce(
  (acc, section) => {
    let { parent, sections } = acc
    const { depth } = section

    if (depth === 0) {
      sections.push(section)
      parent = null
    } else if (depth === 1) {
      sections.push(section)
      parent = section.slug
    } else {
      sections.push({ ...section, parent })
    }

    return { ...acc, parent }
  },
  { sections: [], parent: null }
).sections

export default sections

const matches = (path, section) => {
  let normalizedPath = path

  if (normalizedPath.startsWith('/')) {
    normalizedPath = normalizedPath.slice(1)
  }

  return normalizedPath === section.slug
}

export const getSection = (path, offset = 0) => {
  const index = sections.findIndex(section => matches(path, section))

  if (index === -1) return null

  return sections[index + offset]
}

export const getNextSection = path => getSection(path, 1)

export const getPreviousSection = path => getSection(path, -1)

export const chapters = sections.reduce((ch, section) => {
  const { depth, hidden } = section

  if (hidden) {
    return ch
  }

  if (depth === 0) {
    ch.push([])
  }

  ch[ch.length - 1].push(section)

  return ch
}, [])
