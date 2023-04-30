// In review.component.ts
onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files[0];
  this.uploadImage(file).subscribe(
    (response: string) => {
      // Handle the response (the uploaded image's file name)
      // You can store the file name in your component state and include it in the review object when submitting the form
    },
    (error) => {
      console.error('Failed to upload image', error);
    }
  );
}

uploadImage(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post<string>('http://localhost:8080/api/upload', formData);
}
