import { describe, expect, it, beforeEach } from "vitest";
import { useModal } from "./useModal";
import type { Ref } from "vue";

describe("useModal", () => {
  let isOpen: Ref<boolean>;
  let selectedItemId: Ref<string | null>;
  let open: (id?: string) => void;
  let close: () => void;

  beforeEach(() => {
    const modal = useModal();
    isOpen = modal.isOpen;
    selectedItemId = modal.selectedItemId;
    open = modal.open;
    close = modal.close;
  });

  it("starts closed with no selected item", () => {
    expect(isOpen.value).toBe(false);
    expect(selectedItemId.value).toBeNull();
  });

  it("opens modal without selecting an item", () => {
    open();

    expect(isOpen.value).toBe(true);
    expect(selectedItemId.value).toBeNull();
  });

  it("opens modal with a selected item", () => {
    open("item-1");

    expect(isOpen.value).toBe(true);
    expect(selectedItemId.value).toBe("item-1");
  });

  it("closes modal and clears selected item", () => {
    open("item-1");
    close();

    expect(isOpen.value).toBe(false);
    expect(selectedItemId.value).toBeNull();
  });

  it("can open and close multiple times", () => {
    open("item-1");
    expect(isOpen.value).toBe(true);
    expect(selectedItemId.value).toBe("item-1");

    close();
    expect(isOpen.value).toBe(false);
    expect(selectedItemId.value).toBeNull();

    open("item-2");
    expect(isOpen.value).toBe(true);
    expect(selectedItemId.value).toBe("item-2");

    close();
    expect(isOpen.value).toBe(false);
    expect(selectedItemId.value).toBeNull();
  });
});
