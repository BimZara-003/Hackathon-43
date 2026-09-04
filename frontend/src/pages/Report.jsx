import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Upload, MapPin, ShieldAlert, Sparkles, X } from 'lucide-react';

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const Report = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    severity: 'Medium',
    timeOfDay: '',
    safetyContext: '',
    isAnonymous: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const categories = [
    'Pothole',
    'Streetlight',
    'Drainage',
    'Road Damage',
    'Unsafe Area',
    'Other'
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    if (formData.category === 'Unsafe Area') {
      if (!formData.timeOfDay) newErrors.timeOfDay = 'Please specify the time of day';
      if (!formData.safetyContext.trim()) newErrors.safetyContext = 'Please provide safety context';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files?.[0];
    if (!selectedPhoto) return;

    if (!selectedPhoto.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photo: 'Please choose an image file.' }));
      e.target.value = '';
      return;
    }

    if (selectedPhoto.size > MAX_PHOTO_SIZE) {
      setErrors((prev) => ({ ...prev, photo: 'Image must be 5 MB or smaller.' }));
      e.target.value = '';
      return;
    }

    setPhoto(selectedPhoto);
    setPhotoPreview(URL.createObjectURL(selectedPhoto));
    setErrors((prev) => ({ ...prev, photo: null }));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const submitReport = (data) => {
    // Mock API Call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          suggestedUrgency: data.category === 'Unsafe Area' ? 'High' : 'Medium',
          suggestedCategory: data.category,
          summary: data.description.substring(0, 50) + '...',
          id: 'REP-' + Math.floor(Math.random() * 10000)
        });
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate fetch(POST /reports)
      const aiResult = await submitReport(formData);
      setSubmittedResult(aiResult);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Report Submitted Successfully</h2>
          <p className="text-gray-600 mb-8">Thank you for making our community safer. Your report has been logged.</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-left relative overflow-hidden">
            <Sparkles className="absolute top-4 right-4 w-6 h-6 text-blue-300" />
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
              AI Triage Summary
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <p><strong>Suggested Urgency:</strong> <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${submittedResult.suggestedUrgency === 'High' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{submittedResult.suggestedUrgency}</span></p>
              <p><strong>Category:</strong> {submittedResult.suggestedCategory}</p>
              <p><strong>Summary:</strong> {submittedResult.summary}</p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setSubmittedResult(null);
              setFormData({
                title: '', description: '', category: '', location: '', severity: 'Medium', timeOfDay: '', safetyContext: '', isAnonymous: false
              });
              removePhoto();
            }}
            className="mt-8 px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 font-medium"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  const isUnsafeArea = formData.category === 'Unsafe Area';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Report a Hazard</h1>
        <p className="text-gray-600 mt-2">Help authorities identify and fix issues in your community.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Deep pothole on Main Street"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>{errors.category}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Near Galle Face Green"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                />
                <MapPin className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>{errors.location}</p>}
            </div>
          </div>

          {/* Conditional Women's Safety Fields */}
          {isUnsafeArea && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 space-y-5">
              <div className="flex items-center mb-2">
                <ShieldAlert className="text-orange-600 w-5 h-5 mr-2" />
                <h3 className="font-semibold text-orange-900">Safety Risk Details</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time of Day</label>
                <select
                  name="timeOfDay"
                  value={formData.timeOfDay}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white ${errors.timeOfDay ? 'border-red-300' : 'border-gray-300'}`}
                >
                  <option value="">Select time of day</option>
                  <option value="Unsafe after dark">Unsafe after dark</option>
                  <option value="Unsafe during off-peak hours">Unsafe during off-peak hours</option>
                  <option value="Always unsafe">Always unsafe</option>
                </select>
                {errors.timeOfDay && <p className="text-red-500 text-sm mt-1">{errors.timeOfDay}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Safety Context Prompt</label>
                <p className="text-xs text-gray-500 mb-2">What makes this area feel unsafe? (e.g. poor lighting, isolated area, lack of pedestrian path). Please keep it general and non-graphic.</p>
                <textarea
                  name="safetyContext"
                  value={formData.safetyContext}
                  onChange={handleChange}
                  rows="2"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none ${errors.safetyContext ? 'border-red-300' : 'border-gray-300'}`}
                ></textarea>
                {errors.safetyContext && <p className="text-red-500 text-sm mt-1">{errors.safetyContext}</p>}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Provide more details about the hazard..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none transition-colors ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Severity</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['Low', 'Medium', 'High'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, severity: level}))}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${formData.severity === level ? (level === 'High' ? 'bg-red-500 text-white' : level === 'Medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white') : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
              <input
                ref={photoInputRef}
                id="report-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="sr-only"
              />
              {photoPreview ? (
                <div className="relative flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 p-2">
                  <img src={photoPreview} alt="Selected report" className="h-16 w-16 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-700">{photo.name}</p>
                    <p className="text-xs text-gray-500">{Math.ceil(photo.size / 1024)} KB</p>
                  </div>
                  <label
                    htmlFor="report-photo"
                    className="cursor-pointer rounded px-2 py-1 text-sm font-medium text-orange-600 hover:bg-orange-50"
                  >
                    Change
                  </label>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="rounded p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    aria-label="Remove selected photo"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="report-photo"
                  className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-gray-100"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  <span className="text-sm">Upload Image</span>
                </label>
              )}
              {errors.photo && <p className="mt-1 flex items-center text-sm text-red-500"><AlertCircle className="mr-1 h-4 w-4" />{errors.photo}</p>}
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Submit anonymously (hide my name publicly)
            </label>
          </div>

          <hr className="border-gray-100" />

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg text-white font-medium shadow-sm transition-colors flex items-center ${isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing AI Triage...
                </>
              ) : 'Submit Report'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Report;
