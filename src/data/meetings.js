const getDateAfter = (daysAhead) => {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const makeInitialMeetings = () => [
  {
    id: 'meeting-product-review',
    title: 'Product review',
    date: getDateAfter(1),
    startTime: '10:00',
    location: 'Studio 2',
    participants: ['Ashish Ranjan', 'Mira Patel', 'Jonah Lewis', 'Emil Ortiz'],
    note: 'Leave with one clear decision on the next release.',
    agenda: [
      { id: 'topic-product-1', title: 'Opening and desired outcome', owner: 'Ashish Ranjan', minutes: 5, complete: false },
      { id: 'topic-product-2', title: 'Review launch readiness', owner: 'Mira Patel', minutes: 15, complete: false },
      { id: 'topic-product-3', title: 'Resolve open decisions', owner: 'Jonah Lewis', minutes: 15, complete: false },
      { id: 'topic-product-4', title: 'Confirm owners and next steps', owner: 'Ashish Ranjan', minutes: 10, complete: false },
    ],
  },
  {
    id: 'meeting-design-critique',
    title: 'Design roundtable',
    date: getDateAfter(1),
    startTime: '13:30',
    location: 'North room',
    participants: ['Ashish Ranjan', 'Mira Patel', 'Noor Ahmed'],
    note: 'Bring one example of a moment that feels harder than it should.',
    agenda: [
      { id: 'topic-design-1', title: 'Set the review question', owner: 'Mira Patel', minutes: 5, complete: false },
      { id: 'topic-design-2', title: 'Walk through the new flow', owner: 'Noor Ahmed', minutes: 20, complete: false },
      { id: 'topic-design-3', title: 'Choose the next experiment', owner: 'Ashish Ranjan', minutes: 15, complete: false },
    ],
  },
  {
    id: 'meeting-launch-check',
    title: 'Launch readiness',
    date: getDateAfter(2),
    startTime: '11:00',
    location: 'Conference 1',
    participants: ['Ashish Ranjan', 'Emil Ortiz', 'Noor Ahmed', 'Jonah Lewis'],
    note: 'Escalate anything that could change the planned release date.',
    agenda: [
      { id: 'topic-launch-1', title: 'Check release signals', owner: 'Jonah Lewis', minutes: 15, complete: false },
      { id: 'topic-launch-2', title: 'Review support and handoff', owner: 'Emil Ortiz', minutes: 20, complete: false },
      { id: 'topic-launch-3', title: 'Call the go or no-go', owner: 'Ashish Ranjan', minutes: 10, complete: false },
    ],
  },
]
