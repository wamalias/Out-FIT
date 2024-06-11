package com.capstone.out_fit.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.capstone.out_fit.R
import com.capstone.out_fit.databinding.ActivityMainBinding
import com.google.android.gms.auth.api.signin.GoogleSignIn.getClient
import com.google.android.gms.auth.api.signin.*
import com.google.firebase.auth.FirebaseAuth
import kotlin.math.sign

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    val auth = FirebaseAuth.getInstance()

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

        if (intent.getStringExtra("img_profile") != null) {
            Glide.with(this)
                .load(Uri.parse(intent.getStringExtra("img_profile")))
                .into(binding.imgProfile)
        } else {
            binding.imgProfile.setImageResource(R.drawable.avatar)
        }

        if (intent.getStringExtra("name") != null) {
            binding.name.text = intent.getStringExtra("name")
        } else {
            binding.name.text = "Full Name"
        }

        binding.imgProfile.setOnClickListener{
            auth.signOut()
            val intent = Intent(this, SignActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
}