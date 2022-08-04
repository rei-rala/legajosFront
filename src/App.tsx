import './styles/globals.css'
import Layout from './components/layout'
import { Navigate, Route, Routes } from 'react-router-dom'
import { WorkflowPage, WfResumen, WfTablas, WfAnalistasMail } from './routes'
import { Loader } from './components'


function App() {
  return (
    <Layout>
      <Loader />

      <Routes>
        <Route path="/workflow" element={<WorkflowPage />} />
        
        <Route path="/workflow/analistas" element={<WfResumen />} />
        <Route path="/workflow/analistas/mail" element={<WfAnalistasMail />} />

        <Route path="/workflow/tablas" element={<WfTablas />} />
        <Route path="/workflow/tablas/:seccion" element={<WfTablas />} />

        <Route
          path="/workflow/*"
          element={<Navigate to="/workflow/tablas" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/workflow" />}
        />
      </Routes>
    </Layout >
  )
}

export default App;
