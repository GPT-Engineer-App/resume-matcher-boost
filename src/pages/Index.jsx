import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileUpload(e.target.result);
    };
    reader.readAsText(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.txt,.pdf,.doc,.docx' });

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag 'n' drop a file here, or click to select a file</p>
      )}
    </div>
  );
};

const Index = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [adjustedResume, setAdjustedResume] = useState('');
  const [matchScore, setMatchScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  const handleResumeChange = (e) => setResume(e.target.value);
  const handleJobDescriptionChange = (e) => setJobDescription(e.target.value);
  const handleFileUpload = (content) => setResume(content);

  const analyzeResume = () => {
    if (!resume || !jobDescription) {
      setError('Please provide both a resume and a job description.');
      return;
    }
    setError('');

    // This is where we'd implement the actual resume analysis and adjustment logic
    // For now, we'll just set some dummy data
    setAdjustedResume(resume + "\n\nAdjusted for ATS optimization");
    setMatchScore(75);
    setSuggestions([
      "Add more keywords related to the job description",
      "Quantify your achievements with specific metrics",
      "Use action verbs to describe your experiences"
    ]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">ATS-Friendly Resume Optimizer</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Upload or paste your resume in the "Resume" tab.</li>
            <li>Paste the job description in the "Job Description" tab.</li>
            <li>Click "Analyze and Optimize" to process your resume.</li>
            <li>Review the match score, suggestions, and optimized resume.</li>
            <li>Use the optimized version to improve your chances with ATS systems.</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Our tool analyzes your resume against the job description, identifying key terms and suggesting improvements to increase your chances of passing Applicant Tracking Systems (ATS).
          </p>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Upload or paste your resume and the job description</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="resume">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="job">Job Description</TabsTrigger>
              </TabsList>
              <TabsContent value="resume">
                <div className="space-y-4">
                  <FileUpload onFileUpload={handleFileUpload} />
                  <Textarea
                    placeholder="Or paste your resume here"
                    className="min-h-[200px]"
                    value={resume}
                    onChange={handleResumeChange}
                  />
                </div>
              </TabsContent>
              <TabsContent value="job">
                <Textarea
                  placeholder="Paste the job description here"
                  className="min-h-[300px]"
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button onClick={analyzeResume} className="w-full">Analyze and Optimize</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>ATS-optimized resume and suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            {adjustedResume ? (
              <>
                <div className="mb-4">
                  <Label>Match Score</Label>
                  <Progress value={matchScore} className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">{matchScore}% match with job description</p>
                </div>
                <div className="mb-4">
                  <Label>Suggestions</Label>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Label>Optimized Resume</Label>
                  <ScrollArea className="h-[200px] mt-2 p-4 border rounded-md">
                    <pre className="text-sm whitespace-pre-wrap">{adjustedResume}</pre>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground">Upload a resume and job description, then click "Analyze and Optimize" to see results.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
