import { Heading, Text } from "@chakra-ui/react"
import { Trophy } from "lucide-react"
import React from "react"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import { BestInvestorT } from "@/types"
import { formattedCurrency } from "@/utils/currency"

const Rankings = () => {
  const { data, error, isLoading } = useSWR<BestInvestorT[]>(
    "/best_players",
    fetcher
  )

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Failed to load data</Text>
  if (!data) return <Text>No data</Text>

  return (
    <div>
      <header className="pb-12">
        <Heading
          bgGradient="linear-gradient(90deg, rgba(88,196,96,1) 30%, rgba(0,251,255,1) 100%)"
          bgClip="text"
          className="font-bold text-center pb-4"
        >
          Best Investors
        </Heading>
        <Trophy size={96} className="mx-auto" />
      </header>

      <section>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Placement</Th>
                <Th>Username</Th>
                <Th>Date Joined</Th>
                <Th isNumeric>Number of stocks</Th>
                <Th isNumeric>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((player) => (
                <Tr key={player.username}>
                  <Td>{player.placement}</Td>
                  <Td>{player.username}</Td>
                  <Td>{player.dateJoined}</Td>
                  <Td isNumeric>{player.numberOfStocks}</Td>
                  <Td isNumeric>{formattedCurrency(player.total)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </section>
    </div>
  )
}

export default Rankings
