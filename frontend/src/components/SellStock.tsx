import React from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react"

export function SellStock({
  isOpen,
  onClose,
  stockSymbol,
  quantity,
  setUnitsToSell,
}: {
  isOpen: boolean
  onClose: () => void
  stockSymbol: string
  quantity: number
  setUnitsToSell: (value: number) => void
}) {
  function handleClose() {
    setUnitsToSell(0)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          You sold <span className="text-red-500">{quantity}</span> shares of{" "}
          <span className="text-red-500">{stockSymbol}</span>.
        </ModalHeader>
        <ModalCloseButton />
        <ModalFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
