from flask import Flask, render_template, request, flash
import pyshorteners

app = Flask(__name__)
app.secret_key = "your_secret_key"

@app.route("/", methods=['POST', 'GET'])
def home():
    if request.method == "POST":
        url_received = request.form.get("url")
        
        if not url_received:
            flash("Please enter a valid URL.")
            return render_template("form.html")
        
        try:
            short_url = pyshorteners.Shortener().tinyurl.short(url_received)
            
            return render_template("form.html", new_url=short_url, old_url=url_received)
        except Exception as e:
            flash(f"An error occurred: {e}")
            return render_template("form.html")
    else:
        return render_template('form.html')

if __name__ == "__main__":
    app.run(debug=True)
