import { Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import toast from 'react-hot-toast';
import axios from "axios";

const ProfesionalSummaryForm = ({data, onChange, setResumeData}) => {

         const auth = useSelector((state) => state.auth);
         const token = auth?.token;
     const [isGenerating , setIsGenerating] = useState(false)

     const generateSummary = async () =>{
        try{
            setIsGenerating(true)
            const prompt = `
              Rewrite the following professional summary for a resume.
 
               Requirements:
                - Professional and ATS-friendly
                - 3-4 concise sentences
                 - Highlight key skills and achievements
                  - Use strong action words
                     - Improve grammar and clarity
                    - Return only the improved summary

Summary:
${data}
`;
            const response = await axios.post('http://localhost:3000/api/ai/enhance-pro-sum', {userContent:
                prompt},{headers: {Authorization: `Bearer ${token}`}})
                setResumeData(prev => ({...prev,  professional_summary: response.data.result}))
        }catch(error){
          toast.error(error?.response?.data?.message || error.message)
        }
        finally{
            setIsGenerating(false)
        }
     }

  return (
    <div className='space-y-4'>
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold
                text-gray-900'>Professional Summary</h3>
                <p className='text-sm text-gray-500'>Add summary for your resume here</p>
            </div>
            <button  disabled={isGenerating} onClick={generateSummary} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100
            text-purple-700 rounded hover:bg-purple-200 transition-colors
            disabled:opacity-50'>
                {isGenerating ? (<Loader2 className='size-4 animate-spin '/>):
               ( <Sparkles className='size-4'/>)}
               {isGenerating ? "Enhancing..." : "AI Enhance"}
            </button>
        </div>
        <div className='mt-6'>
            <textarea value={data || ""} onChange={(e)=>onChange(e.target.value)} rows={7}  className='w-full p-3 mt-2 border text-sm
            border-gray-300 rounded-lg focus:ring focus:ring-blue-500
            focus:border-blue-500 outline-none transition-colors resize-none '
            placeholder='write a compelling professional summary that highlights your 
            key strengths and career objectives...'/>
            <p>Tip: Keep it concise (3-4 sentences ) and focus on your most relevant
                achivements and skills.
            </p>
        </div>
    </div>
  )
}

export default ProfesionalSummaryForm
