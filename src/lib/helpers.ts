export async function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) throw new Error('Clipboard not available')
  return navigator.clipboard.writeText(text)
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
