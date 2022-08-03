import React, { createContext, useContext, useEffect, useState } from "react";

export type AnalistaSectionHide = {
  analisis: boolean,
  pendiente: boolean,
  finalizado: boolean,
  devuelto: boolean,
}

type UserContextType = {
  preferences: {
    sectionMaxWidth: boolean,
    analistaSectionHide: AnalistaSectionHide,
    hideHoverInfo: boolean,
  },
  toggleAnalistaHide: (section: keyof AnalistaSectionHide) => void,
  toggleHoverInfo: () => void,
}

export const User = createContext<UserContextType>({
  preferences: {
    hideHoverInfo: false,
    sectionMaxWidth: true,
    analistaSectionHide: {
      analisis: false,
      pendiente: false,
      finalizado: false,
      devuelto: false,
    }
  },
  toggleAnalistaHide: () => { },
  toggleHoverInfo: () => { },
})

type Props = { children: React.ReactNode }

export const UserContext: (props: Props) => JSX.Element = ({ children }) => {
  const [preferences, setPreferences] = useState({
    sectionMaxWidth: true,
    hideHoverInfo: false,
    analistaSectionHide: {
      pendiente: false,
      analisis: false,
      finalizado: false,
      devuelto: false,
    }
  })

  const toggleAnalistaHide = (section: keyof AnalistaSectionHide) => {
    setPreferences({
      ...preferences,
      analistaSectionHide: {
        ...preferences.analistaSectionHide,
        [section]: !preferences.analistaSectionHide[section]
      }
    })
  }

  function toggleHoverInfo() {
    setPreferences({
      ...preferences,
      hideHoverInfo: !preferences.hideHoverInfo
    })
  }

  useEffect(() => {
    preferences.sectionMaxWidth
      ? document.body.classList.add("ignoreSectionMaxWidth")
      : document.body.classList.remove("ignoreSectionMaxWidth")
  }, [preferences.sectionMaxWidth])

  return (
    <User.Provider value={{
      preferences,
      toggleAnalistaHide,
      toggleHoverInfo,
    }}>
      {children}
    </User.Provider>
  )
}

export const useUser = () => {
  const context = useContext(User);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}