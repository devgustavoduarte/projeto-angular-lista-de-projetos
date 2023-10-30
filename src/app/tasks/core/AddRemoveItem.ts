export interface AddRemoveItem {
  onAddItem(): void;
  onRemoveItem(itemId: string): void;
  // onDuplicateItem(itemId: string): void;
}
