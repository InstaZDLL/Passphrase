const API_BASE = 'https://www.passphrase.ch/api/passwords'
const PASSWORD_COUNT = 5

const FIELD_IDS = [
  'nb_mots',
  'separateur',
  'longueur_nombre',
  'caractere_special',
  'longueur_minimale'
]
const TOGGLE_IDS = [
  'majuscule_debut',
  'majuscule_aleatoire',
  'caracteres_accentues'
]
const ALL_IDS = [...FIELD_IDS, ...TOGGLE_IDS]

const DEFAULTS = {
  nb_mots: '2',
  separateur: 'random',
  longueur_nombre: '2',
  caractere_special: 'random',
  longueur_minimale: '12',
  majuscule_debut: true,
  majuscule_aleatoire: false,
  caracteres_accentues: true
}

const SVG_NS = 'http://www.w3.org/2000/svg'

function svg(attrs, ...children) {
  const node = document.createElementNS(SVG_NS, 'svg')
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v)
  for (const child of children) node.appendChild(child)
  return node
}

function svgChild(name, attrs) {
  const node = document.createElementNS(SVG_NS, name)
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v)
  return node
}

function copyIcon() {
  return svg(
    { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
    svgChild('rect', {
      x: '9', y: '9', width: '11', height: '11', rx: '2',
      stroke: 'currentColor', 'stroke-width': '2'
    }),
    svgChild('path', {
      d: 'M5 15V5a2 2 0 0 1 2-2h10',
      stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round'
    })
  )
}

function checkIcon() {
  return svg(
    { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
    svgChild('path', {
      d: 'M5 13l4 4L19 7',
      stroke: 'currentColor',
      'stroke-width': '2.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  )
}

function replaceChild(parent, newChild) {
  while (parent.firstChild) parent.removeChild(parent.firstChild)
  parent.appendChild(newChild)
}

function el(id) {
  return document.getElementById(id)
}

function readSettings() {
  const settings = {}
  for (const id of FIELD_IDS) settings[id] = el(id).value
  for (const id of TOGGLE_IDS) settings[id] = el(id).checked
  return settings
}

function applySettings(settings) {
  for (const id of FIELD_IDS) {
    if (settings[id] !== undefined) el(id).value = settings[id]
  }
  for (const id of TOGGLE_IDS) {
    if (settings[id] !== undefined) el(id).checked = !!settings[id]
  }
}

function saveSettings() {
  return chrome.storage.local.set({ settings: readSettings() })
}

function restoreSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get('settings', ({ settings }) => {
      applySettings({ ...DEFAULTS, ...(settings || {}) })
      resolve()
    })
  })
}

function setLoading(isLoading) {
  el('loader').hidden = !isLoading
  el('generate').disabled = isLoading
  document.querySelector('.results').setAttribute('aria-busy', String(isLoading))
}

function showError(message) {
  const error = el('error')
  error.textContent = message
  error.hidden = false
}

function clearError() {
  el('error').hidden = true
  el('error').textContent = ''
}

function buildQueryParams() {
  const settings = readSettings()
  const params = new URLSearchParams({ count: String(PASSWORD_COUNT) })
  for (const [k, v] of Object.entries(settings)) {
    params.set(k, typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v))
  }
  return params
}

function renderPasswords(passwords) {
  const container = el('result')
  while (container.firstChild) container.removeChild(container.firstChild)

  for (const item of passwords) {
    const row = document.createElement('div')
    row.className = 'password-item'

    const value = document.createElement('p')
    value.className = 'password-item__value'
    value.textContent = item.password

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'copy-btn'
    btn.setAttribute('aria-label', `Copier ${item.password}`)
    btn.appendChild(copyIcon())

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(item.password)
        btn.dataset.copied = 'true'
        replaceChild(btn, checkIcon())
        window.setTimeout(() => {
          btn.dataset.copied = 'false'
          replaceChild(btn, copyIcon())
        }, 1400)
      } catch {
        showError('Impossible de copier dans le presse-papier.')
      }
    })

    row.appendChild(value)
    row.appendChild(btn)
    container.appendChild(row)
  }
}

async function generatePasswords() {
  clearError()
  setLoading(true)

  try {
    const response = await fetch(`${API_BASE}?${buildQueryParams().toString()}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const data = await response.json()
    renderPasswords(data.passwords || [])
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    showError(`Génération échouée (${message}). Vérifie ta connexion.`)
  } finally {
    setLoading(false)
  }
}

function bindAutoSaveAndRegen() {
  for (const id of ALL_IDS) {
    el(id).addEventListener('change', () => {
      saveSettings()
      generatePasswords()
    })
  }
}

function resetAll() {
  applySettings(DEFAULTS)
  saveSettings()
  generatePasswords()
}

document.addEventListener('DOMContentLoaded', async () => {
  await restoreSettings()
  bindAutoSaveAndRegen()
  el('generate').addEventListener('click', generatePasswords)
  el('reset').addEventListener('click', resetAll)
  generatePasswords()
})
