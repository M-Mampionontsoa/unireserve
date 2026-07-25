package com.unireserve.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.unireserve.entity.RefreshToken;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.transaction.Transactional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    List<RefreshToken> findByUserMail(String userMail);
    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiration < :now")
    void deleteByExpirationBefore(@Param("now") LocalDateTime now);
}
