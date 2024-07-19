import React from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
} from "@chakra-ui/react"
import { StocksDataT } from "@/types"

export function BuyStockModal({
  onOpen,
  onClose,
  isOpen,
  stock,
  quantity,
  setNUnits,
}: {
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
  stock: StocksDataT
  quantity: number
  setNUnits: (value: string) => void
}) {
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">
            You bought <span className="font-bold text-green-500">{quantity}</span> shares of{" "}
            <span className="font-bold text-green-500">{stock.stockSymbol}</span>.
          </ModalHeader>
          <ModalFooter className="flex justify-center">
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => {
                onClose()
                // Reset the number of units to buy field
                setNUnits("")
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
