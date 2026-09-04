import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Upload, MapPin, ShieldAlert, Sparkles, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const Report = () => {
  const { token, user } = useAuth();
  const { t } = useLanguage();

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
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
    'Other',
  ];

  const severities = ['Low', 'Medium', 'High'];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';
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

  // Real AI Triage Analysis endpoint call
  const handleAiTriage = async () => {
    if (!formData.description || formData.description.trim().length < 10) {
      setErrors((prev) => ({ ...prev, description: 'Enter at least 10 characters for AI triage' }));
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:5000/reports/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: formData.description }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiResult(data);
        setFormData((prev) => ({
          ...prev,
          category: data.suggestedCategory || prev.category || 'Other',
          severity: data.suggestedUrgency || prev.severity || 'Medium',
        }));
      }
    } catch (err) {
      console.error('AI Triage error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        aiSummary: aiResult?.summary || '',
        aiUrgency: aiResult?.suggestedUrgency || formData.severity,
      };

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:5000/reports', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit report');

      setSubmittedResult(data.report);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Report Logged Successfully!</h2>
          <p className="text-gray-600 mb-6 text-sm">Thank you for making Sri Lankan roads safer. Your report is now live for community & authority action.</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-left relative overflow-hidden">
            <Sparkles className="absolute top-4 right-4 w-6 h-6 text-blue-400" />
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-1.5 text-base">
              <span>AI Smart Triage Result</span>
            </h3>
            <div className="space-y-2 text-sm text-blue-950">
              <p><strong>Category:</strong> <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">{submittedResult.category}</span></p>
              <p><strong>Urgency:</strong> <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${submittedResult.severity === 'High' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'}`}>{submittedResult.severity}</span></p>
              {submittedResult.aiSummary && <p><strong>Summary:</strong> {submittedResult.aiSummary}</p>}
            </div>
          </div>
          
          <button 
            onClick={() => {
              setSubmittedResult(null);
              setAiResult(null);
              setFormData({
                title: '', description: '', category: '', location: '', severity: 'Medium', timeOfDay: '', safetyContext: '', isAnonymous: false
              });
              removePhoto();
            }}
            className="mt-8 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold shadow-md transition-colors"
          >
            Submit Another Hazard Report
          </button>
        </div>
      </div>
    );
  }

  const isUnsafeArea = formData.category === 'Unsafe Area';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('reportFormTitle')}</h1>
        <p className="text-gray-600 mt-2">{t('reportFormSubtitle')}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('fieldTitle')} *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t('fieldTitlePlaceholder')}
              className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.title}</p>}
          </div>

          {/* Description + AI Triage Button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-gray-800">{t('fieldDescription')} *</label>
              <button
                type="button"
                onClick={handleAiTriage}
                disabled={isAnalyzing || formData.description.length < 10}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-full shadow-sm transition-all animate-pulse"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>{t('aiTriageBtn')}</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder={t('fieldDescriptionPlaceholder')}
              className={`w-full px-4 py-2.5 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.description}</p>}

            {/* AI Result Banner */}
            {aiResult && (
              <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-2 text-xs text-blue-900">
                <div className="flex items-center justify-between font-bold text-blue-950">
                  <span className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-blue-600" /> {t('aiTriageTitle')}</span>
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px]">AI Auto-Filled</span>
                </div>
                <p><strong>{t('aiSuggestedCategory')}:</strong> {aiResult.suggestedCategory}</p>
                <p><strong>{t('aiSuggestedUrgency')}:</strong> {aiResult.suggestedUrgency}</p>
                <p className="italic">"{aiResult.summary}"</p>
              </div>
            )}
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">{t('fieldCategory')} *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white`}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">{t('fieldLocation')} *</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={t('fieldLocationPlaceholder')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.location ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm`}
                />
              </div>
              {errors.location && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.location}</p>}
            </div>
          </div>

          {/* Severity Radio Group */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">{t('fieldSeverity')}</label>
            <div className="flex gap-4">
              {severities.map(sev => (
                <label key={sev} className={`flex-1 flex items-center justify-center py-2.5 border rounded-xl cursor-pointer text-sm font-semibold transition-all ${
                  formData.severity === sev
                    ? sev === 'High' ? 'bg-red-50 border-red-500 text-red-700' : sev === 'Medium' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="severity"
                    value={sev}
                    checked={formData.severity === sev}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {sev}
                </label>
              ))}
            </div>
          </div>

          {/* Women's Safety Specific Fields */}
          {isUnsafeArea && (
            <div className="p-5 bg-purple-50 border border-purple-200 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-purple-600" />
                <span>Women's & Vulnerable Group Safety Layer</span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">{t('fieldTimeOfDay')} *</label>
                <input
                  type="text"
                  name="timeOfDay"
                  value={formData.timeOfDay}
                  onChange={handleChange}
                  placeholder="e.g. Unsafe after 8 PM due to zero lighting"
                  className="w-full px-4 py-2 bg-white rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 text-sm"
                />
                {errors.timeOfDay && <p className="mt-1 text-xs text-red-500">{errors.timeOfDay}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">{t('fieldSafetyContext')} *</label>
                <textarea
                  name="safetyContext"
                  rows={2}
                  value={formData.safetyContext}
                  onChange={handleChange}
                  placeholder="Details on lack of lighting, isolation, or past harassment concerns..."
                  className="w-full px-4 py-2 bg-white rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 text-sm"
                />
                {errors.safetyContext && <p className="mt-1 text-xs text-red-500">{errors.safetyContext}</p>}
              </div>
            </div>
          )}

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('fieldPhoto')}</label>
            <input
              ref={photoInputRef}
              id="report-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
            />
            {photoPreview ? (
              <div className="relative flex items-center gap-3 rounded-xl border border-gray-300 bg-gray-50 p-3">
                <img src={photoPreview} alt="Selected report" className="h-16 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-700">{photo.name}</p>
                  <p className="text-xs text-gray-500">{Math.ceil(photo.size / 1024)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="report-photo"
                className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <Upload className="mr-2 h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Upload Image / Photo</span>
              </label>
            )}
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
            />
            <label htmlFor="isAnonymous" className="text-sm text-gray-700 cursor-pointer font-medium">
              {t('fieldAnonymous')}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting Report...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" />
                <span>Submit Road Hazard Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Report;
