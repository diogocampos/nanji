export function isClipboardAvailable(): boolean {
  return !!navigator.clipboard
}

export function copyTextToClipboard(text: string) {
  navigator.clipboard?.writeText(text).catch(console.error) ||
    console.error('Clipboard not available')
}

export function storageItem(key: string, storage = localStorage) {
  function load() {
    return storage.getItem(key)
  }

  function save(value: string | null) {
    if (value !== null) storage.setItem(key, value)
    else storage.removeItem(key)
  }

  return [load, save] as [typeof load, typeof save]
}
