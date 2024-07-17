import React from "react"
import { checkAuthenticated } from "@/utils/checkAuthenticated"
import { ReactNode } from "react"
import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = checkAuthenticated()
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  return children
}
