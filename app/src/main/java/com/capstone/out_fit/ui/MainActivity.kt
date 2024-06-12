package com.capstone.out_fit.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.capstone.out_fit.R
import com.capstone.out_fit.databinding.ActivityMainBinding
import com.google.android.gms.auth.api.signin.GoogleSignIn.getClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val auth = FirebaseAuth.getInstance()

    override fun onStart() {
        super.onStart()
        if (auth.currentUser != null) {
            auth.currentUser?.let {
                binding.name.text = it.displayName
                Glide.with(this)
                    .load(it.photoUrl)
                    .apply(RequestOptions.circleCropTransform())
                    .into(binding.imgProfile)
            }
        } else {
            val intent = Intent(this, SignActivity::class.java)
            startActivity(intent)
            finish()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        enableEdgeToEdge()
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val name = intent.getStringExtra("name")
        val photoUrl = intent.getStringExtra("photoUrl")

        if ((photoUrl != null) && (name != null)) {
            binding.name.text = name
            Glide.with(this)
                .load(photoUrl)
                .apply(RequestOptions.circleCropTransform())
                .into(binding.imgProfile)

        } else {
            binding.name.text = "Unknown user"
            binding.imgProfile.setImageResource(R.drawable.avatar)
        }

        binding.tvImage.setImageResource(R.drawable.photo)

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        val googleSignInClient = getClient(this, gso)

        binding.imgProfile.setOnClickListener{
            auth.signOut()
            googleSignInClient.signOut()
                .addOnCompleteListener {
                    val intent = Intent(this, SignActivity::class.java)
                    startActivity(intent)
                    finish()
                }
        }
    }
}