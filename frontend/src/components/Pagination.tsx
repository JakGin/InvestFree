import React, { useState } from "react"
import { Box, Button, HStack, Text } from "@chakra-ui/react"

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <HStack spacing={2}>
      <Button onClick={handlePrevious} isDisabled={currentPage === 1}>
        Previous
      </Button>
      <Text>
        Page {currentPage} of {totalPages}
      </Text>
      <Button onClick={handleNext} isDisabled={currentPage === totalPages}>
        Next
      </Button>
    </HStack>
  )
}
