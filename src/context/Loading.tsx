import { Loader } from "components";
import React, { createContext, useContext, useEffect, useState } from "react";

type LoadingContextType = {
  isLoading: boolean;
  currentlyLoading: string[];

  /**
   * Adds a reason to the list of reasons to be loading.
  */
  pushLoading: (reason: string) => void;

  /**
   * Removes a reason from the list of reasons to be loading.
   */
  popLoading: (reason: string) => void;
}

export const Loading = createContext<LoadingContextType>({
  isLoading: false,
  currentlyLoading: [],
  pushLoading: () => { },
  popLoading: () => { }
})

type Props = { children: React.ReactNode }

export const LoadingContext: (props: Props) => JSX.Element = ({ children }) => {
  const [currentlyLoading, setCurrentlyLoading] = useState<string[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);

  /**
   * Adds a reason to the list of reasons to be loading.
   * @param reason: string
   * @description: Push a reason to the currently loading array
   */
  const pushLoading = (reason: string) => {
    if (reason in currentlyLoading) {
      return;
    }
    setCurrentlyLoading([...currentlyLoading, reason]);
  }

  /**
   * Removes the reason from the currently loading array.
   * @param reason: string
   * @description: Removes the reason from the currently loading array.
   */
  const popLoading = (reason: string) => {
    setCurrentlyLoading(currentlyLoading.filter(r => r !== reason));
  }

  useEffect(() => {
    setIsloading(currentlyLoading.length > 0);
  }, [currentlyLoading])

  return (
    <Loading.Provider value={{
      isLoading,
      currentlyLoading,
      pushLoading, popLoading
    }}>
      {children}
    </Loading.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(Loading);

  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }

  return context;
}